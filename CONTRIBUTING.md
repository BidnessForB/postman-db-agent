# Contributing to Database Agent

Thank you for your interest in contributing to the Database Agent project! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. By participating, you agree to uphold this code.

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (5.7 or higher)
- Git
- npm or yarn

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/node-data.git
   cd node-data
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/BidnessForB/node-data.git
   ```

## Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database settings
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=users
# DB_PORT=3306
```

### 3. Database Setup (Optional)
```bash
# Set up the sample database for testing
chmod +x db/setup_database.sh
./db/setup_database.sh
```

### 4. Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
```

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes** - Fix issues and improve stability
- **New features** - Add functionality while maintaining simplicity
- **Documentation** - Improve README, code comments, and guides
- **Tests** - Add or improve test coverage
- **Performance** - Optimize existing code
- **Examples** - Add usage examples and tutorials

### Code Standards

- **Language**: Node.js with CommonJS (require/module.exports)
- **Style**: Use ES6+ features (const, let, arrow functions, async/await)
- **Indentation**: 2 spaces
- **Naming**: camelCase for variables and functions
- **Comments**: JSDoc for functions and complex logic

### Code Quality Requirements

- Small, focused functions with single responsibilities
- Comprehensive error handling with try-catch blocks
- Meaningful variable and function names
- Comments for complex logic
- No sensitive data in code (use environment variables)

## Pull Request Process

### Before Submitting

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code standards

3. **Test your changes**:
   ```bash
   npm test
   npm run test:coverage
   ```

4. **Update documentation** if needed

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Submitting a Pull Request

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Describe testing performed

3. **Follow the PR template** (if available)

### PR Review Process

- Maintainers will review your code
- Address any feedback promptly
- Keep PRs focused and reasonably sized
- Respond to review comments constructively

## Issue Reporting

### Before Creating an Issue

1. Check existing issues and discussions
2. Search for similar problems
3. Ensure you're using the latest version

### Creating a Good Issue

**Bug Reports** should include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)
- Relevant code snippets

**Feature Requests** should include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if you have ideas)
- Any alternatives considered

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/add-user-authentication`
- `fix/database-connection-error`
- `docs/update-api-documentation`
- `test/add-integration-tests`

### Commit Messages

Follow conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `perf:` - Performance improvements

Examples:
```
feat: add support for PostgreSQL databases
fix: resolve connection pool memory leak
docs: update API endpoint documentation
test: add integration tests for stored procedures
```

## Testing

### Test Structure

- **Unit Tests** - Test individual functions (`test/database.test.js`)
- **Integration Tests** - Test API endpoints (`test/api.test.js`)
- **Simple Tests** - Test dependencies and configuration (`test/simple.test.js`)

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test files
npm test test/database.test.js

# Run in watch mode
npm run test:watch
```

### Test Requirements

- All tests must pass
- Maintain or improve test coverage
- Add tests for new features
- Update tests when fixing bugs

## Documentation

### Documentation Standards

- Keep documentation up-to-date with code changes
- Use clear, concise language
- Include code examples where helpful
- Follow the existing documentation structure

### Types of Documentation

- **README.md** - Project overview and quick start
- **API Documentation** - Endpoint descriptions and examples
- **Database Documentation** - Schema and setup instructions
- **Code Comments** - Inline documentation for complex logic

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version number updated
- [ ] CHANGELOG.md updated
- [ ] Release notes prepared

## Getting Help

### Community Support

- **GitHub Discussions** - Ask questions and share ideas
- **GitHub Issues** - Report bugs and request features
- **Pull Requests** - Contribute code and documentation

### Development Resources

- **Node.js Documentation** - https://nodejs.org/docs/
- **MySQL Documentation** - https://dev.mysql.com/doc/
- **Express.js Guide** - https://expressjs.com/guide/
- **Jest Testing** - https://jestjs.io/docs/getting-started

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to the Database Agent project! 🎉
