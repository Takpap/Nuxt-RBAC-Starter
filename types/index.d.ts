import { PrismaClient } from '@prisma/client'

// 扩展 PrismaClient 的声明
declare module '@prisma/client' {
  interface PrismaClient {
    menu: any
    roleMenu: any
  }
  
  interface Role {
    menus?: any[]
  }
}

// 声明bcrypt模块
declare module 'bcrypt' {
  export function hash(data: string, saltOrRounds: string | number): Promise<string>
  export function compare(data: string, encrypted: string): Promise<boolean>
}

// 声明jsonwebtoken模块
declare module 'jsonwebtoken' {
  export function sign(payload: any, secretOrPrivateKey: string, options?: any): string
  export function verify(token: string, secretOrPublicKey: string, options?: any): any
}

// 声明全局变量 process
declare global {
  var process: {
    env: {
      [key: string]: string | undefined
    }
    exit(code?: number): void
  }
} 