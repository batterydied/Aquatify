export function calculateItemWidthAndRow(itemSpacing: number, desiredItemWidth: number, width: number){
    const itemsPerRow = width / (desiredItemWidth + itemSpacing) >= 2 ? Math.floor(width / (desiredItemWidth + itemSpacing)) : 2;
    const itemWidth = (width - itemSpacing * (itemsPerRow - 1)) / itemsPerRow - 20;
    return { itemsPerRow, itemWidth };
}