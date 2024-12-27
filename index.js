const outputs = process.env.RELEASE_PLEASE

console.log('--- RAW ---')
console.log(outputs)
console.log()
console.log('--- PARSED ---')
console.log(JSON.parse(outputs))
