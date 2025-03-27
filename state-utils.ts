/**
 * Utility functions for state management in the hotel management system
 */

// Function to update an item in an array
export function updateItemInArray<T extends { id: number | string }>(
  array: T[],
  itemId: number | string,
  updateFn: (item: T) => T,
): T[] {
  return array.map((item) => {
    if (item.id === itemId) {
      return updateFn(item)
    }
    return item
  })
}

// Function to remove an item from an array
export function removeItemFromArray<T extends { id: number | string }>(array: T[], itemId: number | string): T[] {
  return array.filter((item) => item.id !== itemId)
}

// Function to add an item to an array with a unique ID
export function addItemToArray<T extends { id?: number | string }>(
  array: T[],
  item: Omit<T, "id">,
  idGenerator?: () => number | string,
): T[] {
  const newId = idGenerator
    ? idGenerator()
    : Math.max(0, ...array.map((i) => (typeof i.id === "number" ? i.id : 0))) + 1
  return [...array, { ...item, id: newId } as T]
}

