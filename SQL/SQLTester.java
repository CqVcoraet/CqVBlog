// Imported Packages
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Duration;
import java.util.Queue;

public class SQLTester extends AbstractTester {
    private boolean showConsoleColors;
    private boolean printFailuresOnly;
    private int expectedTotalTests;

    // SQLite Database URL
    private final String dbURL;

    public SQLTester() {
        this(true, false, 100, "posts.db");
    }

    public SQLTester(boolean showConsoleColors, boolean printFailuresOnly, int expectedTotalTests, String dbURL) {
        super(showConsoleColors, printFailuresOnly, expectedTotalTests);
        this.dbURL = dbURL;
    }

    private Connection getConnection() throws SQLException {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException e) {
            throw new SQLException("SQLite JDBC driver not found", e);
        }

        String jdbcUrl = this.dbURL;
        if (!jdbcUrl.startsWith("jdbc:sqlite:")) {
            jdbcUrl = "jdbc:sqlite:" + jdbcUrl;
        }

        return DriverManager.getConnection(jdbcUrl);
    }

    /**
     * Sends an HTTP GET request to the Firestore endpoint and returns the response.
     */
    private HttpResponse<String> getFirebaseConnection() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://firestore.googleapis.com/v1/projects/cqvblog/databases/(default)/documents"))
                .timeout(Duration.ofSeconds(10))
                .GET()
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    public static void main(String[] args) {
        SQLTester tester = new SQLTester(true, false, 100, "posts.db");
        tester.runTests();
    }

    private void runTests() {
        printTest("testConnection()", testConnection());
        printTest("testFirebaseConnection()", testFirebaseConnection());
        printTest("testTableExists()", testTableExists());
        printTest("testTotalRecordCount()", testTotalRecordCount());
        printTest("showFullTable()", showFullTable());
        printFinalSummary();
    }

    private ResultSet executeSQL(String sql) throws SQLException {
        Connection conn = getConnection();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(sql);
        return rs;
    }

    private boolean testConnection() {
        try {
            Connection conn = getConnection();
            return true;
        } catch (SQLException e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        } catch (Exception e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        }
    }

    private boolean testFirebaseConnection() {
        try {
            HttpResponse<String> response = getFirebaseConnection();
            int status = response.statusCode();
            // Status code in 2xx, 3xx or 4xx range indicates that the endpoint is reachable and responded
            return status >= 200 && status < 500;
        } catch (Exception e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        }
    }

    private boolean testTableExists() {
        String sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='posts'";
        try {
            executeSQL(sql);
            return true;
        } catch (SQLException e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        } catch (Exception e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        }
    }

    private boolean testTotalRecordCount() {
        String sql = "SELECT COUNT(*) AS total FROM posts";
        try {
            ResultSet rs = executeSQL(sql);
            if (rs.next()) {
                int count = rs.getInt("total");
                return count > 0;
            }
            return false;
        } catch (SQLException e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        } catch (Exception e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        }
    }

    private boolean showFullTable() {
        try {
            ResultSet rs = executeSQL("SELECT * FROM posts");
            boolean hasRows = false;
            while (rs.next()) {
                hasRows = true;
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String content = rs.getString("content");
                String category = rs.getString("category");
                String topic = rs.getString("topic");
                String date = rs.getString("date");

                StringBuilder str = new StringBuilder();
                str.append(id);
                str.append(" | ");
                str.append(title);
                str.append(" | ");
                str.append(content);
                str.append(" | ");
                str.append(category);
                str.append(" | ");
                str.append(topic);
                str.append(" | ");
                str.append(date);

                System.out.println(str.toString());
            }
            return hasRows;
        } catch (SQLException e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        } catch (Exception e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        }
    }
}