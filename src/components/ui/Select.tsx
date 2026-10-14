import { Select as MantineSelect, SelectProps } from "@mantine/core";

export default function Select(
    props: SelectProps
) {
    return (
        <MantineSelect
            allowDeselect={false}
            radius="xl"
            classNames={{
                input: "!bg-slate-100 dark:!bg-slate-800/80 !text-slate-800 dark:!text-slate-100 !border-slate-300 dark:!border-slate-700 text-xs font-medium cursor-pointer placeholder:!text-slate-400 focus:!border-teal-500",
                dropdown: "!bg-white dark:!bg-[#17202d] !border-slate-200 dark:!border-slate-700 !text-slate-800 dark:!text-slate-100 shadow-xl !rounded-lg p-1",
                option: "text-xs !text-slate-700 dark:!text-slate-200 hover:!bg-slate-100 dark:hover:!bg-slate-700/60 !rounded-lg transition-colors",
            }}
            {...props}
        />
    );
}