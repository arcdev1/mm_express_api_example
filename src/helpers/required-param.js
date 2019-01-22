import { RequiredParameterError } from './errors'

export default function requiredParam (param) {
  throw new RequiredParameterError(param)
}
