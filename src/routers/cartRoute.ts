import { Router } from 'express'

import cartController from '../controllers/cartController'
import { verifyAdmin, verifyUserId, verifyUserLogin } from '../middlewares/userMiddlewares'
import { verifyCart, verifyCartId } from '../middlewares/cartMiddlewares'
/**
 * @route get-'' if you're a admin, getting every carts and all other related data, 
 * @route post-'' if you're a user, creating new order using userId , products {productId, quantity},
 * @route get-'/:cartId' if you're a user getting single user carts using cartId
 * @route get-'/:cartId/:status' if you're a user getting/ filter single user carts using cartId and status
 * @route put-'/:cartId' updating single cart and using cartId and products {productId, quantity},
 * @route delete-'/:cartId' if you're a user, deleting single cart/ order and all other related data using cartId, 
 */
const cartRouter = Router()

cartRouter.get('/:page/:limit/:sort', verifyAdmin, cartController.getAllCarts)

cartRouter.post('', verifyUserLogin, verifyCart, cartController.createCart)

cartRouter.get('/:cartId', verifyUserLogin, verifyCartId, cartController.getSingleCartById)

cartRouter.get(
  '/:userId/:status/:page/:limit/:sort',
  verifyUserLogin,
  verifyUserId,
  cartController.getCartByUserId
)

cartRouter.put('/:cartId', verifyUserLogin, verifyCartId, verifyCart, cartController.updateCart)

cartRouter.delete('/:cartId', verifyUserLogin, verifyCartId, cartController.deleteCart)

export default cartRouter
