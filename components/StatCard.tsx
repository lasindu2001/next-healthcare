type StatCardProps = {
    type: "appointments" | "pending" | "cancelled";
    count: number;
    label: string;
    icon: string;
};

const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
    return (
        <div>StatCard</div>
    )
}

export default StatCard