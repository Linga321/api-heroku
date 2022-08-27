import { NextFunction, Request, Response } from 'express'

import cartService from '../services/cartService'

const getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
  const carts = await cartService.getAllCarts()
  return res.json(carts)
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
  const cart = req.body
  const cartCreate = await cartService.insertCart(cart)
  return res.json(cartCreate)
}

const updateCart = async (req: Request, res: Response) => {
  const { cartId } = req.params
  const cart = req.body
  const cartUpdate = await cartService.updateCart(cartId,cart)
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

