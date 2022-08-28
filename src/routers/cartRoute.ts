import { Router } from 'express'

import cartController from '../controllers/cartController'
import { verifyAdmin, verifyUserLogin } from '../middlewares/userMiddlewares'

const cartRouter = Router()

cartRouter.get('', verifyAdmin, cartController.getAllCarts)

cartRouter.post('', verifyUserLogin, cartController.createCart)

cartRouter.get('/:cartId', verifyUserLogin, cartController.getSingleCartById)

cartRouter.get(
  '/:userId/:status',
  verifyUserLogin,
  cartController.getCartByUserId
)

cartRouter.put('', verifyUserLogin, cartController.updateCart)

cartRouter.delete('/:cartId', verifyUserLogin, cartController.deleteCart)

export default cartRouter
