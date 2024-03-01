import KoaRouter from '@koa/router'
import { FieldFilterConfig, FilterType } from '../../common/types'
import { setValues } from './queryFunctions'

export const routes = (router: KoaRouter) => {
  router.get('(.*)/search/get-field-filters', async (ctx) => {
    if (ctx.state.user.role !== 'Admin') {
      console.error('User role is wrong', ctx.state.user)
      return (ctx.status = 403)
    }

    const fieldFilterConfigs: FieldFilterConfig[] = [
      {
        fieldName: 'depositor',
        displayName: 'Deponent',
        filterType: FilterType.values,
        visualSize: 3,
      },
      {
        fieldName: 'archiveInitiator',
        parentField: 'depositor',
        displayName: 'Arkivbildare',
        filterType: FilterType.values,
        visualSize: 3,
      },
    ]

    await setValues(
      fieldFilterConfigs,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'allValues'
    )

    ctx.body = fieldFilterConfigs
  })
}
