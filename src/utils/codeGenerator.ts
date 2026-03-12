import type { AlgorithmModule } from '../types';

export type SupportedLanguage = 'python' | 'java' | 'cpp' | 'c' | 'javascript';

const languageExtensions: Record<SupportedLanguage, string> = {
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    javascript: 'js'
};

export const getFileExtension = (lang: SupportedLanguage) => languageExtensions[lang];

export function generateSourceCode(algo: AlgorithmModule, lang: SupportedLanguage): string {
    const { name, category, complexity, pseudocode } = algo;

    const blockCommentStart = lang === 'python' ? '"""' : '/**';
    const blockCommentLine = lang === 'python' ? '' : ' * ';
    const blockCommentEnd = lang === 'python' ? '"""' : ' */';
    const inlineComment = lang === 'python' ? '#' : '//';

    const header = `${blockCommentStart}
${blockCommentLine}Algorithm: ${name}
${blockCommentLine}Category:  ${category}
${blockCommentLine}Time:      ${complexity.time}
${blockCommentLine}Space:     ${complexity.space}
${blockCommentLine}
${blockCommentLine}This is an auto-generated template based on the algorithm's pseudocode.
${blockCommentEnd}\n\n`;

    let body = '';
    const formattedPseudo = pseudocode.map(line => `    ${inlineComment} ${line.trim()}`).join('\n');

    switch (lang) {
        case 'python':
            body = `def solve_${algo.id.replace(/-/g, '_')}():\n${formattedPseudo}\n    pass\n\nif __name__ == "__main__":\n    print("Running ${name}...")\n    solve_${algo.id.replace(/-/g, '_')}()\n`;
            break;
        case 'java':
            const className = name.replace(/[^a-zA-Z0-9]/g, '');
            body = `public class ${className} {\n\n    public static void solve() {\n${formattedPseudo}\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Running ${name}...");\n        solve();\n    }\n}\n`;
            break;
        case 'cpp':
            body = `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nvoid solve() {\n${formattedPseudo}\n}\n\nint main() {\n    cout << "Running ${name}..." << endl;\n    solve();\n    return 0;\n}\n`;
            break;
        case 'c':
            body = `#include <stdio.h>\n#include <stdlib.h>\n\nvoid solve() {\n${formattedPseudo}\n}\n\nint main() {\n    printf("Running ${name}...\\n");\n    solve();\n    return 0;\n}\n`;
            break;
        case 'javascript':
            body = `function solve_${algo.id.replace(/-/g, '_')}() {\n${formattedPseudo}\n}\n\nconsole.log("Running ${name}...");\nsolve_${algo.id.replace(/-/g, '_')}();\n`;
            break;
    }

    return header + body;
}
