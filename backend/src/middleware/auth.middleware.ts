import { Request, Response, NextFunction } from 'express'

export const checkLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.isLoggedIn) {
    res.status(301).redirect('/signup')
    return
  }
  next()
}