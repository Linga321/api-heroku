import { NextFunction, Request, Response } from 'express'
import { NotFoundError } from 'src/helpers/apiError'
import Cart from '../models/Cart'

import cartService from '../services/cartService'

const getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
  const carts = await cartService.getAllCarts()
  if (carts) {
    return res.json(carts) //res.json(jwt_.encode(auth, 'test_key'))
  } else {
    next(new NotFoundError('Carts not found'))
  }
}

const getCartByUserId = async (req: Request, res: Response) => {
  const { userId, status } = req.params
  const cart = await cartService.getCartByUserId(userId, status)
  return res.json(cart)
}

const getSingleCartById = async (req: Request, res: Response) => {
  const { cartId } = req.params
  const cart = await cartService.getSingleCartById(cartId)
  return res.json(cart)
}

const createCart = async (req: Request, res: Response) => {
  const { cart } = req.body
  const cartCreate = await cartService.insertCart(new Cart(cart))
  return res.json(cartCreate)
}

const updateCart = async (req: Request, res: Response) => {
  const { cartId } = req.params
  const cart = req.body
  const cartUpdate = await cartService.updateCart(cartId, cart)
  return res.json(cartUpdate)
}

const deleteCart = async (req: Request, res: Response) => {
  const { cartId } = req.params
  const cart = await cartService.deleteCart(cartId)
  return res.json(cart)
}

export default {
  getAllCarts,
  getCartByUserId,
  getSingleCartById,
  updateCart,
  deleteCart,
  createCart,
}
