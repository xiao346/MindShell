export function Mascot({ avatar = false, className = '' }: { avatar?: boolean; className?: string }) {
  return <span className={`${avatar ? 'mascot-avatar' : 'mascot-figure'} ${className}`}>
    <img src={`${import.meta.env.BASE_URL}mascot/reading-girl.png`} alt={avatar ? '' : '手绘女孩安静地读着书'} draggable={false} />
  </span>
}
