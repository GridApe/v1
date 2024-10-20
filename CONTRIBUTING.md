# Contributing to GridApe

We're thrilled that you're interested in contributing to our Next.js project! This document outlines the process for contributing and some best practices to follow. By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. **Fork the Repository**: Click the "Fork" button in the upper right corner of the repository's GitHub page. This creates a copy of the repository in your GitHub account.

2. **Clone Your Fork**: Clone your fork to your local machine:

   ```
   git clone git@github.com:GridApe/v1.git
   cd project-name
   ```


## Making Changes

1. **Create a Branch**: Always create a new branch for your changes:

   ```
   git checkout -b feature/your-feature-name
   ```

   Use a descriptive branch name, e.g., `feature/add-dark-mode` or `fix/navbar-alignment`.

2. **Make Your Changes**: Write your code and make your changes in this branch.

3. **Follow Coding Standards**: Adhere to the project's coding standards and style guide. Run linters and formatters before committing:

   ```
   yarn lint
   yarn format
   ```

4. **Write Tests**: If you're adding new features or fixing bugs, write tests to cover your changes.

5. **Commit Your Changes**: Make small, focused commits with clear messages:

   ```
   git commit -m "Add feature: dark mode toggle"
   ```

## Submitting Changes

1. **Keep Your Fork Updated**: Regularly sync your fork with the upstream repository:

   ```
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Push Your Changes**: Push your branch to your fork on GitHub:

   ```
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**: Go to the original repository on GitHub and click "New Pull Request". Choose your fork and the branch containing your changes.

4. **Describe Your Changes**: In the pull request description, clearly explain your changes and their purpose. Reference any related issues.

5. **Review Process**: Maintainers will review your PR. Be open to feedback and make any requested changes.

## Best Practices

- **Keep PRs Small and Focused**: Each pull request should address a single feature or fix.
- **Write Meaningful Commit Messages**: Use clear, concise commit messages that explain the "why" behind changes.
- **Document Your Changes**: Update documentation, including README files and inline comments, as necessary.
- **Be Respectful**: When discussing changes or reviewing code, always be respectful and constructive.
- **Test Thoroughly**: Ensure your changes don't break existing functionality and add new tests as needed.
- **Follow the Project Structure**: Adhere to the existing project structure and naming conventions.

## Getting Help

If you have questions or need help, please:
- Check the project's documentation
- Open an issue for discussion
- Reach out to the maintainers

Thank you for contributing to GridApe!