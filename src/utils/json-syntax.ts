export type TokenType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation' | 'indent';

export interface Token {
    type: TokenType;
    value: string;
    line: number;
    pairIndex?: number;
    parentScopeId?: number;
    id: number;
}

export interface ParsedJson {
    tokens: Token[];
    lines: Token[][];
    bracketPairs: Map<number, number>;
}

export const parseJsonTokens = (jsonString: string): ParsedJson => {
    const resultTokens: Token[] = [];
    const resultLines: Token[][] = [[]];
    const bracketPairsMap = new Map<number, number>();
    const scopeStack: number[] = [];
    
    // Matches newlines, indents, strings (with escaped chars), booleans, null, numbers, and punctuation
    const regex = /(\n|^[ ]+|"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{} [\]]|[^\s\w])/gm;
    
    let match;
    let idCounter = 0;
    let currentLine = 1;

    while ((match = regex.exec(jsonString)) !== null) {
        const value = match[0];
        let type: TokenType = 'punctuation';

        if (value === '\n') {
            resultLines.push([]);
            currentLine++;
            continue;
        }

        if (/^[ ]+$/.test(value)) {
            type = 'indent';
        } else if (/^"/.test(value)) {
            if (/:$/.test(value)) {
                type = 'key';
            } else {
                type = 'string';
            }
        } else if (/^(true|false)$/.test(value)) {
            type = 'boolean';
        } else if (value === 'null') {
            type = 'null';
        } else if (/^-?\d/.test(value)) {
            type = 'number';
        }

        const token: Token = { 
            type, 
            value, 
            line: currentLine, 
            id: idCounter++ 
        };

        // Identify parent scope for this token
        if (scopeStack.length > 0) {
            token.parentScopeId = scopeStack[scopeStack.length - 1];
        }
        
        // Bracket matching logic
        if (value === '{' || value === '[') {
            scopeStack.push(token.id);
        } else if (value === '}' || value === ']') {
            const openId = scopeStack.pop();
            if (openId !== undefined) {
                bracketPairsMap.set(openId, token.id);
                bracketPairsMap.set(token.id, openId);
                
                // After popping, the parent scope for this closing bracket 
                // is what's now at the top of the stack
                if (scopeStack.length > 0) {
                    token.parentScopeId = scopeStack[scopeStack.length - 1];
                } else {
                    token.parentScopeId = undefined;
                }
            }
        }

        resultTokens.push(token);
        resultLines[resultLines.length - 1].push(token);
    }

    // Apply pair indices back to tokens
    resultTokens.forEach(t => {
        if (bracketPairsMap.has(t.id)) {
            t.pairIndex = bracketPairsMap.get(t.id);
        }
    });

    return { tokens: resultTokens, lines: resultLines, bracketPairs: bracketPairsMap };
};
