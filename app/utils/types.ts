import type { AppLoadContext } from 'remix'
import type { Params } from 'react-router'

interface DataFunctionArgs {
  request: Request
  context: AppLoadContext
  params: Params<string>
}

export type LoaderFunctionType<Data> = (args: DataFunctionArgs) => Promise<Data>
