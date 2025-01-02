import * as core from "@actions/core"

function main(): void {
  const val = parseInt(process.env.TEST_VAR as string) + 1

  core.exportVariable("TEST_VAR", `${val}`)
}

main()
