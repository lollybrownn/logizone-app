import { Sidebar } from "../../components/Sidebar"


export const PendataanBarang = () => {
    return (
        <div className="flex flex-row min-h-screen">
            <Sidebar className="flex-none"/>

            <div className="flex-1 bg-[#F8F9FA] p-6">
                <h1 className="text-2xl font-bold">Pendataan Barang</h1>
            </div>
        </div>
    )
}