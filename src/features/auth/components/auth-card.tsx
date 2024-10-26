import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { BackButton } from "./back-button"
import Socials from "./socials"

type AuthCardProps = {
  children: React.ReactNode
  cardTitle: string
  backButtonHref: string
  backButtonLabel: string
  showSocials?: boolean
}

export const AuthCard = ({
  children,
  cardTitle,
  backButtonHref,
  backButtonLabel,
  showSocials,
}: AuthCardProps) => {
  return (
    <Card className="w-full md:w-2/3 xl:w-1/2 mx-auto">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>

      <CardContent>{children}</CardContent>

      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}

      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  )
}
