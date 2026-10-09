# QA Practices

This doc covers two things: how I report bugs, and how I use version control and CI in
a QA context.

---

## Bug Reporting

I use a consistent template for bug reports to keep them reproducible and easy to
triage: a clear summary, numbered repro steps, expected vs. actual behavior,
environment details, severity classification, and suggested test cases to verify the
fix.

### Template

```markdown
## Summary
**Brief description of the bug:**

## Steps to Reproduce
1. **Step 1:**
2. **Step 2:**
3. **Step 3:**

## Expected Behavior
**What should happen instead:**

## Actual Behavior
**What actually happens:**

## Screenshots
**If applicable, add screenshots to help explain your problem:**

## Environment
- **Operating System:**
- **Browser/Version:**
- **Version of the software:**

## Additional Context
**Add any other context about the problem here, such as logs, configuration files, or related issues:**

## Possible Solution
**If you have an idea of how to fix the bug, please describe it here:**

## Severity
- **[ ] Critical** - Blocks all work, requires immediate fix
- **[ ] Major** - Significant impact but not a showstopper
- **[ ] Minor** - Low impact, cosmetic issues
- **[ ] Trivial** - Very minor issue

## Test Cases
**Describe how the bug can be tested to ensure it's fixed:**

1. **Test Case 1:**
2. **Test Case 2:**
```

### Filled Example

> **Summary:** The application crashes when attempting to filter search results with
> multiple criteria.
>
> **Steps to Reproduce:**
> 1. Open the application and navigate to the search page.
> 2. Enter a search term in the search box.
> 3. Select multiple filters from the filter options (e.g., Category, Date Range).
> 4. Click the "Apply Filters" button.
> 5. Observe the application behavior.
>
> **Expected Behavior:** The application should apply the selected filters and display
> the search results without crashing.
>
> **Actual Behavior:** The application crashes and displays an error message:
> "Unexpected error occurred. Please try again."
>
> **Environment:** Windows 10, latest Chrome (stable channel), app version 1.2.3.
>
> **Additional Context:** See error log snippet attached to the original issue.
>
> **Possible Solution:** Check the `SearchFilterManager` class for null pointer
> dereferences; ensure all filter options are properly initialized before applying.
>
> **Severity:** Minor, low impact, cosmetic issue.
>
> **Test Cases:**
> 1. Perform a search with a single filter and verify results display correctly.
> 2. Apply multiple filters and confirm results display without crashing.
> 3. Validate the error message no longer appears when applying filters.

---

## Version Control & CI Workflow

My approach to version control centers on keeping `main` stable while automation
scripts evolve on short-lived branches:

- **Branching:** feature branches for new automation/test coverage, bugfix branches for
  issues found during testing, merged back into `main` via pull request.
- **Pull requests:** each PR includes the relevant test changes and links to any
  related issues, reviewed before merging.
- **Issue tracking:** bugs and gaps found during testing are tracked as GitHub Issues
  and linked to the PR that resolves them.
- **Continuous Integration:** GitHub Actions runs the Playwright suite
  (see [CI/CD](../CI-CD/CI-CD-Documentation.md)) on every push and pull request to
  `main`, so changes are verified automatically before merging rather than relying on
  manual re-testing.
