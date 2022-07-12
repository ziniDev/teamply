import models from '~/models'
import response from '~/libs/response'

module.exports = {
  test: async (ctx) => {
    let result = true

    response.send(ctx, result)
  },
}
