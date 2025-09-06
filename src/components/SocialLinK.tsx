import Link from 'next/link'
import React from 'react'
import Linkden from './icons/linkden'
import Facebook from './icons/facebook'
import Instagram from './icons/instagram'
import Sport from './icons/sport'
import Tweeter from './icons/tweeter'
const MapIcon = {
    linkden: Linkden,
    facebook: Facebook,
    instagram: Instagram,
    tweeter: Tweeter,
    sport: Sport,
}

type SocialLinkProps = {
    icon : keyof typeof  MapIcon,
    href: string;
}
function SocialLinK(props:SocialLinkProps) {
    const Icon = MapIcon[props.icon]
    return (
        <Link href={props.href} className='rounded-full border-zinc-900 border aspect-square justify-center items-center flex w-10'>
            <Icon />
        </Link>
    )
}

export default SocialLinK