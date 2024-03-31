/** 校验邮箱格式 */
export const checkEmail = (mail: string) => {
    if (!mail) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(mail)
}