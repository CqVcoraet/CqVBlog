public abstract class AbstractTester {
    // Console Colors
    protected final String WARNPRINT;
    protected final String ERRORPRINT;
    protected final String BLUECYAN;
    protected final String PURPLE;
    protected final String GREEN;
    protected final String LIME;
    protected final String MAGENTA;
    protected final String LIGHTBLUE;
    protected final String RESET;

    // Options
    private boolean showConsoleColors;
    private boolean printFailuresOnly;

    // Test Tracking
    protected int passes;
    protected int fails;
    protected int totalRun;
    protected int secPasses;
    protected int secFails;
    protected int secTotal;
    protected long startTime;
    protected long endTime;
    protected int expectedTotalTests;

    // Special Vars
    public static final int DISABLE_COLORS = 0;
    public static final int ENABLE_COLORS = 1;

    public AbstractTester() {
        this(false, false, 0);
    }

    public AbstractTester(boolean showConsoleColors, boolean printFailuresOnly, int expectedTotalTests) {
        this.showConsoleColors = showConsoleColors;
        this.printFailuresOnly = printFailuresOnly;
        this.expectedTotalTests = expectedTotalTests;

        if (showConsoleColors) {
            WARNPRINT  = "\u001B[38;2;255;201;0m";   // #FFC900
            ERRORPRINT = "\u001B[38;2;255;0;0m";     // #FF0000
            BLUECYAN   = "\u001B[38;2;5;219;252m";   // #05DBFC
            PURPLE     = "\u001B[38;2;128;0;128m";   // #800080
            GREEN      = "\u001B[38;2;0;255;0m";     // #00FF00
            LIME 	   = "\u001B[38;2;124;187;0m";   // #7CBB00
            MAGENTA    = "\u001B[38;2;255;0;255m";   // #FF00FF
            LIGHTBLUE  = "\u001B[38;2;5;185;250m";   // #05B9FA
            RESET      = "\u001B[0m";                // Reset to default
        } else {
            WARNPRINT = "";
            ERRORPRINT = "";
            BLUECYAN = "";
            PURPLE = "";
            GREEN = "";
            LIME = "";
            MAGENTA = "";
            LIGHTBLUE = "";
            RESET = "";
        }
        this.passes = 0;
        this.fails = 0;
        this.totalRun = 0;
        this.secPasses = 0;
        this.secFails = 0;
        this.secTotal = 0;
        this.startTime = System.nanoTime();
        this.endTime = 0;
    }

    public int getPasses() {
        return passes;
    }

    public int getFails() {
        return fails;
    }

    public int getTotalRun() {
        return totalRun;
    }

    public int secPasses() {
        return secPasses;
    }

    public int getSecTotal() {
        return secTotal;
    }

    public long getStartTime() {
        return startTime;
    }

    public long getEndTime() {
        return endTime;
    }

    public int getExpectedTotalTests() {
        return expectedTotalTests;
    }

    protected void stopTimer() {
        this.endTime = System.nanoTime();
    }

    /**
     * Sets the console colors to either on or off. Console colors are off by default.
     * @param value - Must be either a 0 or 1. For simplicity, use AbstractTester.DISABLE_COLORS or AbstractTester.ENABLE_COLORS
     */
    protected void setConsoleColorSetting(int value) {
        if (value < 0 || value > 1) {
            throw new IllegalArgumentException("Value must be either a 0 or 1.");
        }
        if (value == 0) {
            showConsoleColors = false;
        } else {
            showConsoleColors = true;
        }
    }

    /**
     * Sets the number of expected total tests to the set value. Value must be greater than 0.
     * @param value - The number of tests to set to
     */
    protected void setExpectedTotalNumTests(int value) {
        if (value < 1) {
            throw new IllegalArgumentException("Value must be greater than 0.");
        }

        this.expectedTotalTests = value;
    }

    /** Print test results in a consistent format
	 * @param testDesc description of the test
	 * @param result indicates if the test passed or failed
	 */
	protected void printTest(String testDesc, boolean result) {
		totalRun++;
		if (result) { 
			passes++; 
		} else { 
			fails++; 
		}
		if (!result || !printFailuresOnly) {
			String prefix = "Test " + totalRun + ": ";
			String status = result ? "   PASS" : "***FAIL***";
			// Calculate exact spacing needed to align status at column 80
			int targetColumn = 80;
			int currentLength = prefix.length() + testDesc.length();
			int spacesNeeded = Math.max(1, targetColumn - currentLength);
			String spaces = " ".repeat(spacesNeeded);
			String line = prefix + testDesc + spaces + status;
			if (result) {
				System.out.println(GREEN + line + RESET);
			} else {
				System.out.println(WARNPRINT + line + RESET);
			}
		}
	}

	/** Print a final summary */
	protected void printFinalSummary() {
		stopTimer();
		long elapsedTime = endTime - startTime;
		String line = "";
		// compute percentages safely (avoid divide-by-zero)
		double percentRun = expectedTotalTests == 0 ? 0.0 : ((double) totalRun) * 100.0 / ((double) expectedTotalTests);
		double percentPassed = totalRun == 0 ? 0.0 : ((double) passes) * 100.0 / ((double) totalRun);
		double percentFailed = totalRun == 0 ? 0.0 : ((double) fails) * 100.0 / ((double) totalRun);
		String verdict = String.format("\n%sTotal Tests Run: %d out of %d (%.3f%%)%s,  %sPassed: %d (%.3f%%)%s,  %sFailed: %d (%.3f%%)%s\n",
			LIGHTBLUE, totalRun, expectedTotalTests, percentRun, RESET, GREEN, passes, percentPassed, RESET, WARNPRINT, fails, percentFailed, RESET);
		for (var i = 0; i < verdict.length(); i++) {
			line += "-";
		}
        String setting1 = (this.showConsoleColors) ? "Show Console Colors: ON" : "Show Console Colors: OFF";
        String setting2 = (this.printFailuresOnly) ? "Print Failures Only: ON" : "Print Failures Only: OFF";

		System.out.println(line);
		System.out.println(verdict);
		System.out.println();
		System.out.println();
		System.out.println(LIGHTBLUE + "Settings Selected:");
		System.out.println();
        System.out.println(setting1);
        System.out.println(setting2);
        System.out.println();
		System.out.println(LIME + "Total Computational Time: " + elapsedTime + " ns " + "(" + ((double)(elapsedTime) / 1000000000.0) + " s)" + RESET);
		System.out.println();
	}

	/** Print a section summary */
	protected void printSectionSummary() {
		secTotal = totalRun - secTotal;
		secPasses = passes - secPasses;
		secFails = fails - secFails;
		System.out.printf(BLUECYAN + "\nSection Tests: %d,  Passed: %d,  Failed: %d" + RESET + "\n", secTotal, secPasses, secFails);
		secTotal = totalRun; //reset for next section
		secPasses = passes;
		secFails = fails;		
		System.out.printf(BLUECYAN + "Tests Run So Far: %d,  Passed: %d (%.1f%%),  Failed: %d (%.1f%%)" + RESET + "\n",
				totalRun, passes, passes*100.0/totalRun, fails, fails*100.0/totalRun);
	}

    /**
     * Prints a section header, intended to describe what the section is about
     * @param title - The section header
     */
    protected void printSectionHeader(String title) {
        System.out.println("\n" + PURPLE + "===== " + title + " =====" + RESET);
    }

    /**
     * Asserts that two objects are equal. If they are not, prints a failure message.
     * @param desc - Description of the test
     * @param expected - The expected value
     * @param actual - The actual value
     */
    protected void assertEquals(String desc, Object expected, Object actual) {
        boolean pass = (expected == null && actual == null) || (expected != null && expected.equals(actual));
        if (!pass) {
            printTest(desc, false);
            System.out.println(ERRORPRINT + "Expected: " + expected + ", but got: " + actual + RESET);
        } else {
            printTest(desc, true);
        }
    }
}