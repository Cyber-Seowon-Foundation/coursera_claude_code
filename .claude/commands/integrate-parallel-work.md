I have features developed in parallel worktrees that I need to integrate: $ARGUMENTS

Please help me integrate these features:
1. Create a new integration branch called `integration/parallel-features-<timestamp>` (use a timestamp suffix like YYYYMMDD-HHMMSS to avoid conflicts if this command is run multiple times)
2. For each feature name provided, merge the branch `feature/[feature-name]` into the integration branch
3. Resolve any merge conflicts that arise
4. Test that all features work together
5. Run all tests to ensure nothing is broken
6. Once integration is successful, open a pull request to main rather than merging directly — do NOT push or merge to main without explicit user confirmation, since main is a protected branch

I want to integrate these safely before merging to main.
