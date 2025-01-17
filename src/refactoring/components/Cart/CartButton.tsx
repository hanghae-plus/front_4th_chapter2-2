// interface의 porps 순서
// 1. 변수 -> 함수 순
// 2. 필수 값 -> 비필수 값
interface ButtonProps {
  children: React.ReactNode
  className?: string
  isDisabled?: boolean
  onClick: () => void
}

export const CartButton = ({ children, className, isDisabled, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className={className} disabled={isDisabled}>
      {children}
    </button>
  )
}
