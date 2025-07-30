import { Button } from "antd"

function Page404() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-neutral-300">404</h1>
                <p className="mt-4 text-xl text-neutral-600">PAGE NOT FOUND</p>
                <Button
                    type="primary"
                    onClick={() => window.history.back()}
                    className="mt-6 btn-touch btn-primary"
                >
                    Go Back
                </Button>
            </div>
        </div>
    )
}

export default Page404