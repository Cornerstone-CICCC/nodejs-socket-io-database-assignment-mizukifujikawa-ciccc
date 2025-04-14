import { Request, Response } from 'express';
import { User, IUser } from '../models/user.model';
import bcrypt from 'bcrypt'

const getUserByUsername = async (req: Request<{ username: string }>, res: Response) => {
  const { username } = req.params
  const user = await User.findOne({ username });
  if (!user) {
    res.status(404).send('User not found!')
    return
  }
  res.status(200).json(user)
}

const addUser = async (req: Request<{}, {}, IUser>, res: Response) => {
  console.log("addUser", req.body)
  const { username, password, firstname, lastname } = req.body
  if (!username || !password || !firstname || !lastname) {
    res.status(500).json({ error: 'Some of the user information is empty!' })
    return
  }

  const exist = await User.findOne({ username });
  if (exist) {
    res.status(409).json({ error: 'Username is already taken!' });
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    const user = new User({ username, password: hashedPassword, firstname, lastname });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error add user failed' });
  }
};


const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' })
      return
    }

    const exist = await User.findOne({ username });
    if (!exist) {
      res.status(401).json({ error: 'User not found' });
      return
    }
    const isMatch: boolean = await bcrypt.compare(password, exist.password)
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid password' });
    }

    if (req.session) {
      req.session.isLoggedIn = true
      req.session.username = username
    }

    res.status(200).send("Successfully logged in!")
};

const logoutUser = (req: Request, res: Response) => {
  req.session = null
  res.status(200).json({
    content: "User logout!"
  })
}

const checkCookie = async (req: Request, res: Response) => {
  if (req.session && req.session.username) {
      const username = req.session.username
      const user = await User.findOne({ username });
      if (!user) {
          res.status(404).send('User not found!')
          return
      }
      res.status(200).json({
          content: req.session.message,
          user: user,
          isLoggedIn: true
      })
      return
  }
  res.status(500).json({
    content: "No cookie found!"
  })
}

export default {
  getUserByUsername,
  addUser,
  loginUser,
  logoutUser,
  checkCookie,
}