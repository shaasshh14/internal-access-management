interface CheckboxProps {
    label: string;
    checked?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function Checkbox({
    label,
    checked,
    onChange,
}: CheckboxProps) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded"
            />

            <span>{label}</span>
        </label>
    );
}   