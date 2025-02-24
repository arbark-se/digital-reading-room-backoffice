import knex from 'knex'
import config from '../../../common/config'
import { Import, ImportLevel } from '../../../common/types'

const db = knex({
  client: 'pg',
  connection: {
    host: config.indexDatabase.host,
    user: config.indexDatabase.user,
    password: config.indexDatabase.password,
    database: config.indexDatabase.database,
    port: config.indexDatabase.port,
    timezone: 'UTC',
    dateStrings: true,
  },
})

export const getImports = async () => {
  const result = (await db
    .select({ importName: 'depositor' })
    .sum({ successful: 'successful' })
    .sum({ failed: 'failed' })
    .min({ created: 'created' })
    .max({ crawled: 'crawled' })
    .from<Import>('levels')
    .groupBy('depositor')
    .orderBy('created', 'desc')) as Import[]

  if (result.length > 0) {
    for (const importInstance of result) {
      const levels = await db
        .select<ImportLevel[]>('*')
        .from('levels')
        .where('depositor', importInstance.importName)
      importInstance.levels = levels
    }
  }

  return result
}

export const createImport = async (name: string, levelIds: string[]) => {
  for (const levelId of levelIds) {
    let splits = levelId.split(",");
    let level = splits[0];
    let levelName = "obekant nivånamn";
    if (splits.length > 1) {
      levelName = splits[1].trim();
    }

    await db('levels').insert({
      level: level,
      level_name: levelName,
      depositor: name,
      archivist: name,
    })
  }
}
