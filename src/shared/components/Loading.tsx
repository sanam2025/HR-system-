

type loadingProps = {
    size?: number;
    color?: string; 
    borderWidth?: string;
}

function Loading({size = 3 , color , borderWidth} : loadingProps) {
  return (
    <div style={{width: `${size}rem` , height: `${size}rem` , borderColor: color || "#155dfc" , borderBottomColor: 'transparent' , borderWidth: borderWidth}} className={`relative border-4 border-b-transparent animate-spin rounded-full`}>
    </div>
  )
}

export default Loading