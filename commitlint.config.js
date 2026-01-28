
// Note: Changed to export default
export default {
    extends: ['@commitlint/config-conventional'],
    plugins: [
        {
            rules: {
                'header-match-issue-id': (parsed) => {
                    const { header } = parsed;
                    // Check for GitHub Issue ID, e.g., (#123) -> only digits
                    const regex = /\s\(#[0-9]+\)$/;
                    if (regex.test(header)) {
                        return [true];
                    }
                    return [false, 'Header must end with (#issue-id)! e.g. feat: fix bug (#123)'];
                },
                'body-be-detailed': (parsed) => {
                    const { body } = parsed;
                    if (body && body.length >= 10) {
                        return [true];
                    }
                    return [false, 'Body is too short! Please provide a detailed description (at least 10 characters).'];
                }
            }
        }
    ],
    rules: {
        'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert']],
        'type-case': [2, 'always', 'lower-case'],
        'scope-case': [2, 'always', 'lower-case'],
        'header-match-issue-id': [2, 'always'],
        'body-be-detailed': [2, 'always'],
        'body-leading-blank': [2, 'always'],
        // "Force footer keywords" - enforcing references (like 'Closes #123')
        'references-empty': [2, 'never'],
        'footer-leading-blank': [2, 'always'],
    }
};