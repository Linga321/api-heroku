import { NextFunction, Request, Response } from 'express'
import { InternalServerError, NotFoundError } from '../helpers/apiError'
import Cart from '../models/Cart'

import cartService from '../services/cartService'
/**
 * Getting all Carts infomation.
 * Access Level : Admin
 * @param req none, middleware check user level
 * @param res if carts is found in Carts, return carts
 * @param next if cart is not found when carts in empty NotFoundError
 * @returns res
 */
const getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
  const foundCarts = await cartService.getAllCarts()
  if (foundCarts) {
    return res.json(foundCarts) //res.json(jwt_.encode(auth, 'test_key'))
  } else {
    next(new NotFoundError('Carts not found'))
  }
}
/**
 * Getting all Carts infomation filtered by userId, status.
 * Access Level : User
 * @param req @params userId, status[Paid |Pending| Suspend]
 * @param res if carts is found in Carts, return carts
 * @param next if cart is not found NotFoundError
 * @returns res
 */
const getCartByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, status } = req.params
  const foundCart = await cartService.getCartByUserId(userId, status)
  if (foundCart) {
    return res.json(foundCart)
  } else {
    next(new NotFoundError('Cart Not found'))
  }
}
/**
 * Getting Sigle Cart infomation using cartId.
 * Access Level : User
 * @param req @params userId
 * @param res if carts is found in Carts, return carts
 * @param next if cart is not found NotFoundError
 * @returns res
 */
const getSingleCartById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cartId } = req.params
  const foundCart = await cartService.getSingleCartById(cartId)
  if (foundCart) {
    return res.json(foundCart)
  } else {
    next(new NotFoundError('Cart Not found'))
  }
}
/**
 * Create Cart infomation.
 * Access Level : User
 * @param req @body userId ,
 *                   products [{productId:tsring, itemQuantuty}]
 *                   status - if payment is complete then 'Paid'
 *                          - if payment is not complete then 'Pending'
 *                          - if payment is complete, then cancelled then 'Suspend'
 * @param res if carts is created in Carts, return carts
 * @param next if cart is not created InternalServerError
 * @returns res
 */
const createCart = async (req: Request, res: Response, next: NextFunction) => {
  const { cart } = req.body
  const created = await cartService.insertCart(new Cart(cart))
  if (created) {
    return res.json(created)
  } else {
    next(new InternalServerError('Error occured while storing cart'))
  }
}
/**
 * Updating Sigle Cart infomation using cartId.
 * Access Level : User
 * @param req   @params cartId - for finding and updating document
 *              @body  userId ,
 *                   products [{productId:tsring, itemQuantuty}]
 *                   status - if payment is complete then 'Paid'
 *                          - if payment is not complete then 'Pending'
 *                          - if payment is complete, then cancelled then 'Suspend'
 * @param res if cart is updated in Carts, return cart
 * @param next if cart is not updated InternalServerError
 * @returns res
 */
const updateCart = async (req: Request, res: Response, next: NextFunction) => {
  const { cartId } = req.params
  const cart = req.body
  const updated = await cartService.updateCart(cartId, cart)
  if (updated) {
    return res.json(updated)
  } else {
    next(new InternalServerError('Error occured while updating cart'))
  }
}
/**
 * Deleting Sigle Cart infomation using cartId.
 * Access Level : User
 * @param req   @params cartId - for finding and deleting document
 * @param res if cart is deleted in Carts, return cart
 * @param next if cart is not deleted InternalServerError
 * @returns res
 */
const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  const { cartId } = req.params
  const deleted = await cartService.deleteCart(cartId)
  if (deleted) {
    return res.json(deleted)
  } else {
    next(new InternalServerError('Error occured while deleting cart'))
  }
}

export default {
  getAllCarts,
  getCartByUserId,
  getSingleCartById,
  updateCart,
  deleteCart,
  createCart,
}
