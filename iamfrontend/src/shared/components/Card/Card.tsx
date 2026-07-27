interface CardProps {
    children: React.ReactNode;
}

export default function Card({
    children,
}: CardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            {children}
        </div>
    );
}