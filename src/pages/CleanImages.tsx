import { Button } from "@/components/ui/button"
import { cleanImageUrls } from "@/lib/appwrite/api"
import { useState } from "react"

const CleanImages = () => {
    const [isCleaning, setIsCleaning] = useState(false)
    const [result, setResult] = useState<string>("")

    const handleClean = async () => {
        try {
            setIsCleaning(true)
            const result = await cleanImageUrls()
            setResult(JSON.stringify(result, null, 2))
        } catch (error) {
            setResult(JSON.stringify(error, null, 2))
        } finally {
            setIsCleaning(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Clean Image URLs</h1>
            <p className="text-light-3 mb-4 text-center max-w-lg">
                This will remove transformation parameters from image URLs to prevent the "Image transformations blocked" error.
            </p>
            <Button 
                onClick={handleClean}
                disabled={isCleaning}
                className="mb-4"
            >
                {isCleaning ? "Cleaning..." : "Clean Image URLs"}
            </Button>
            {result && (
                <pre className="bg-gray-100 p-4 rounded-lg mt-4 max-w-lg overflow-auto">
                    {result}
                </pre>
            )}
        </div>
    )
}

export default CleanImages 