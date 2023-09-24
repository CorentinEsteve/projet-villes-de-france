export function createInfoList(emoji, text, value, type) {
    let formattedValue = value.toLocaleString('fr-FR');

    return `
        <tr>
            <td class="emoji">${emoji}</td>
            <td class="info-text">${text}</td>
            <td class="info-value">${formattedValue}${type ? ` ${type}` : ''}</td>
        </tr>
    `;
}