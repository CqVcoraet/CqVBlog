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

    // Shared state to pass the document path from the add test to the delete test
    private String lastCreatedDocumentPath;

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
        printTest("testFirebaseLatency()", testFirebaseLatency());
        printTest("testFirebasePostsCollection()", testFirebasePostsCollection());
        printTest("testFirebaseAddPost()", testFirebaseAddPost());
        printTest("testTableExists()", testTableExists());
        printTest("testTotalRecordCount()", testTotalRecordCount());
        printTest("showFullTable()", showFullTable());
        printTest("testFirebaseDeletePost()", testFirebaseDeletePost());
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
            if (status >= 200 && status < 500) {
                return true;
            } else {
                System.out.print(ERRORPRINT);
                System.out.println("   [Error] Firebase connection returned unexpected HTTP status code: " + status);
                System.out.print(RESET);
                return false;
            }
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
            ResultSet rs = executeSQL(sql);
            if (rs.next()) {
                return true;
            } else {
                System.out.print(ERRORPRINT);
                System.out.println("   [Error] The 'posts' table was not found in the database schema.");
                System.out.print(RESET);
                return false;
            }
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
                if (count > 0) {
                    return true;
                } else {
                    System.out.print(ERRORPRINT);
                    System.out.println("   [Error] The 'posts' table is completely empty (contains 0 records).");
                    System.out.print(RESET);
                    return false;
                }
            }
            System.out.print(ERRORPRINT);
            System.out.println("   [Error] Failed to retrieve any record count metadata from the database.");
            System.out.print(RESET);
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
            if (!hasRows) {
                System.out.print(ERRORPRINT);
                System.out.println("   [Error] Could not show table contents because the 'posts' table has no records.");
                System.out.print(RESET);
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

     /**
     * Measures the round-trip latency to the Firebase Firestore endpoint.
     */
    private boolean testFirebaseLatency() {
        try {
            long startTime = System.currentTimeMillis();
            getFirebaseConnection();
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            System.out.println("   [Latency]: " + duration + " ms");
            
            // Latency under 1.5 seconds is acceptable, lower is better
            if (duration < 1500) {
                return true;
            } else {
                System.out.print(ERRORPRINT);
                System.out.println("   [Error] Firebase connection latency is too high: " + duration + " ms (Expected < 1500 ms).");
                System.out.print(RESET);
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Checks if the "posts" collection in Firestore is accessible and queryable.
     */
    private boolean testFirebasePostsCollection() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://firestore.googleapis.com/v1/projects/cqvblog/databases/(default)/documents/posts"))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            int status = response.statusCode();
            
            // 200 means documents exist; 404 means the collection is currently empty/doesn't exist yet but endpoint is fully working.
            if (status == 200) {
                System.out.println("   [Collection Status]: Active & Contains data.");
                return true;
            } else if (status == 404) {
                System.out.println("   [Collection Status]: Reachable (Collection is empty or rules are restricting public reads).");
                return true;
            } else {
                System.out.print(ERRORPRINT);
                System.out.println("   [Error] Firestore endpoint returned error code " + status + " while reading 'posts' collection.");
                System.out.print(RESET);
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Test 5: Creates a post in the cloud database and stores its generated ID path.
     */
    private boolean testFirebaseAddPost() {
        try {
            HttpClient client = HttpClient.newHttpClient();
            
            String testJson = "{"
                    + "\"fields\": {"
                    + "  \"title\": {\"stringValue\": \"Add Method Test\"},"
                    + "  \"content\": {\"stringValue\": \"Verifying standalone write operation.\"},"
                    + "  \"category\": {\"stringValue\": \"Technology\"},"
                    + "  \"topic\": {\"stringValue\": \"Java REST\"},"
                    + "  \"date\": {\"stringValue\": \"" + java.time.Instant.now().toString() + "\"}"
                    + "}"
                    + "}";

            HttpRequest writeRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://firestore.googleapis.com/v1/projects/cqvblog/databases/(default)/documents/posts"))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(testJson))
                    .build();

            HttpResponse<String> writeResponse = client.send(writeRequest, HttpResponse.BodyHandlers.ofString());
            if (writeResponse.statusCode() != 200) {
                System.out.print(ERRORPRINT);
                System.out.println("   [Error] Create post failed. Server returned HTTP status: " + writeResponse.statusCode());
                System.out.print(RESET);
                return false;
            }

            // Extract and store the path for testFirebaseDeletePost
            String body = writeResponse.body();
            String nameKeyword = "\"name\": \"";
            int nameIndex = body.indexOf(nameKeyword);
            if (nameIndex == -1) {
                System.out.print(ERRORPRINT);
                System.out.println("   [Error] Create post failed. Unable to locate document path 'name' in Firestore response payload.");
                System.out.print(RESET);
                return false;
            }

            int start = nameIndex + nameKeyword.length();
            int end = body.indexOf("\"", start);
            this.lastCreatedDocumentPath = body.substring(start, end);
            
            System.out.println("   [Add Status]: Successfully created document under path: " + this.lastCreatedDocumentPath);
            return true;

        } catch (Exception e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        }
    }

    /**
     * Test 6: Accesses, deletes, and double-verifies the removal of the post created in Test 5.
     */
    private boolean testFirebaseDeletePost() {
        if (this.lastCreatedDocumentPath == null || this.lastCreatedDocumentPath.isEmpty()) {
            System.out.print(ERRORPRINT);
            System.out.println("   [Error] Standalone delete failed. No document path was stored by the preceding add test.");
            System.out.print(RESET);
            return false;
        }

        try {
            HttpClient client = HttpClient.newHttpClient();
            URI docUri = URI.create("https://firestore.googleapis.com/v1/" + this.lastCreatedDocumentPath);

            // 1. READ & VERIFY the document exists
            HttpRequest readRequest = HttpRequest.newBuilder()
                    .uri(docUri)
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> readResponse = client.send(readRequest, HttpResponse.BodyHandlers.ofString());
            if (readResponse.statusCode() != 200) {
                System.out.print(ERRORPRINT);
                System.out.println("   [Error] Delete pre-verification failed. The document path is unreachable. Status: " + readResponse.statusCode());
                System.out.print(RESET);
                return false;
            }

            // 2. DELETE the document
            HttpRequest deleteRequest = HttpRequest.newBuilder()
                    .uri(docUri)
                    .timeout(Duration.ofSeconds(10))
                    .DELETE()
                    .build();

            HttpResponse<String> deleteResponse = client.send(deleteRequest, HttpResponse.BodyHandlers.ofString());
            if (deleteResponse.statusCode() != 200) {
                System.out.print(ERRORPRINT);
                System.out.println("   [Error] Delete operation failed. Server rejected the deletion request. Status: " + deleteResponse.statusCode());
                System.out.print(RESET);
                return false;
            }

            // 3. READ & VERIFY the document is gone (Should return 404)
            HttpResponse<String> postDeleteResponse = client.send(readRequest, HttpResponse.BodyHandlers.ofString());
            if (postDeleteResponse.statusCode() != 404) {
                System.out.print(ERRORPRINT);
                System.out.println("   [Error] Delete verification failed. Document is still accessible in the cloud after successful deletion status. Status: " + postDeleteResponse.statusCode() + " (Expected 404)");
                System.out.print(RESET);
                return false;
            }

            System.out.println("   [Cleanup Status]: Standalone verification & deletion successfully complete.");
            return true;

        } catch (Exception e) {
            System.out.print(ERRORPRINT);
            e.printStackTrace();
            System.out.print(RESET);
            return false;
        }
    }
}