function makeTimestamp() {
    const date = new Date()
    return `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getMilliseconds()}`
}
module.exports = {
    makeTimestamp,
}