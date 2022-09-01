import { Request, Response, NextFunction } from 'express'

import {
  BadRequestError,
  NotFoundError,
} from '../helpers/apiError'
import cartService from '../services/cartService'
require('dotenv').config()

/**
 * This to verify the ckeck the data exited
 * Access Level : User/ Admin
 * @param req @params cartId to check the cartId already exist
 * @param res if not cartd is not found then return NotFoundError
 * @param next if yes, go to next function
 */
export const verifyCartId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cartId } = req.params
  const foundCart = await cartService.getSingleCartById(cartId)
  if (foundCart) {
    next()
  } else {
    next(new NotFoundError(`cartId :${cartId} not found`))
  }
}
/**
 * This to verify the ckeck the data send by user have required infromation
 * Access Level : User/ Admin
 * @param req @body cart to check the required infromation
 * @param res if cart is not contains equired infromation the return BadRequestError
 * @param next if yes, go to next function
 */
export const verifyCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cart } = req.body
  if (cart?.products) {
    if (
      cart?.status &&
      cart?.status !== 'Paid' &&
      cart?.status != 'Pending' &&
      cart?.status !== 'Suspend'
    ) {
      next(new BadRequestError(`cart information in :${cart} not valid`))
    } else {
      next()
    }
  } else {
    next(new BadRequestError(`cart information in :${cart} not valid`))
  }
}
