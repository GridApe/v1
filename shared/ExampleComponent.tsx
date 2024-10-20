import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreateButton } from "./buttons/CreateButton"

export default function ExampleComponent() {
  return (
    <div className="p-4 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-foreground mb-4">Design System Example</h1>
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="john@example.com" type="email" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Submit</Button>
        </CardFooter>
      </Card>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Color Examples</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="p-4 bg-primary text-primary-foreground rounded">Primary</div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded">Secondary</div>
          <div className="p-4 bg-accent text-accent-foreground rounded">Accent</div>
          <div className="p-4 bg-muted text-muted-foreground rounded">Muted</div>
          <div className="p-4 bg-destructive text-destructive-foreground rounded">Destructive</div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Chart Color Examples</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="p-4 bg-chart-1 text-white rounded">Chart 1</div>
          <div className="p-4 bg-chart-2 text-white rounded">Chart 2</div>
          <div className="p-4 bg-chart-3 text-white rounded">Chart 3</div>
          <div className="p-4 bg-chart-4 text-white rounded">Chart 4</div>
          <div className="p-4 bg-chart-5 text-white rounded">Chart 5</div>
        </div>
      </div>

      <CreateButton />
    </div>
  )
}