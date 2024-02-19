export function convertToRegexWhiteList(whiteList: string[]): RegExp[] {
    return whiteList.map((item) => {
        return new RegExp(`^${item.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`);
    });
}
