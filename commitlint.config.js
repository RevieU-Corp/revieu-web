// 注意这里：改成 export default
export default {
    extends: ['@commitlint/config-conventional'],
    plugins: [
        {
            rules: {
                'header-match-issue-id': (parsed) => {
                    const { header } = parsed;
                    const regex = /\s\(#\d+\)$/; // 检查 (#123)
                    if (regex.test(header)) {
                        return [true];
                    }
                    return [false, 'Header 必须以 (#issue-id) 结尾！例如: feat: fix bug (#123)'];
                },
                'body-be-detailed': (parsed) => {
                    const { body } = parsed;
                    if (body && body.length >= 10) {
                        return [true];
                    }
                    return [false, 'Body 描述太短了！请详细说明改动内容 (至少10个字符)。'];
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
        'references-empty': [2, 'never'],
    }
};