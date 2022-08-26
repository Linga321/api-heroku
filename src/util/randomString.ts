const rand = (length: number) => {
  return Math.random().toString(length).substr(2)
}

const tokenGenerator = () => {
  return rand(36) + rand(36)
}
const fileNameGenerator = () => {
  return rand(20) + rand(20)
}

export default { tokenGenerator, fileNameGenerator }
