import { Sidebar } from "../components/Sidebar"


export const Dashboard = () => {
    return (
        <div className="flex flex-row min-h-screen">
            {/* Sidebar usually has a fixed width or specific sizing */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 bg-[#F8F9FA] p-6">
                {/* Your content goes here */}
                <h1 className="text-2xl font-bold">Main Dashboard</h1>
            </div>
        </div>
    )
}