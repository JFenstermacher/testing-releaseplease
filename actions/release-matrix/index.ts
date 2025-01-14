import * as core from "@actions/core"

export type ReleasePleaseOutputs = Record<string, string>

export type Include = {
  release_created: string
  name: string
  path: string
  tag_name: string
  version: string
}

export type Releases = {
  include: Include[]
}

export type Parsed = {
  releasesCreated: boolean
  releases: Releases
}

export function parse(outputs: string): Parsed {
  const obj = JSON.parse(outputs) as ReleasePleaseOutputs;
  const parsed: Parsed = {
    releasesCreated: false,
    releases: {
      include: []
    }
  }

  const packageKeys = [
    "release_created",
    "name",
    "path",
    "tag_name",
    "version"
  ]

  const packages: Record<string, Include> = {}

  for (const [k, v] of Object.entries(obj)) {
    if (!k.includes("--")) {
      continue;
    }

    const [path, key] = k.split("--")
    if (!packageKeys.includes(key)) {
      continue
    }

    const pack = packages[path] || {} as Record<string, string>

    pack[key as keyof Include] = v

    packages[path] = pack
  }

  // NOTE: release-please sets releases_created to always be true regardless of whether packages were created
  // this is a better check of whether the release pipelines should be run
  parsed.releasesCreated = Object.keys(packages).length > 0
  parsed.releases.include = Object.values(packages)

  return parsed
}

async function main() {
  try {
    const outputs = core.getInput("release-please-outputs", { required: true })
    const { releasesCreated, releases } = parse(outputs)

    core.info(`Releases created: ${releasesCreated}`)
    core.setOutput("releases-created", releasesCreated)

    core.info("releases", JSON.stringify(releases, null, 2))
    core.setOutput("releases", JSON.stringify(releases))
  } catch (err) {
    core.setFailed(err as Error)
  }
}

if (import.meta.main) {
  main();
}
