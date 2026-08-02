import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { VariantDeleteButton } from "./VariantDeleteButton";

interface VariantItem {
  id: number;
  name: string;
}

interface VariantSectionProps {
  title: string;
  fieldName: string;
  placeholder: string;
  items: VariantItem[];
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (id: number, formData: FormData) => Promise<void>;
  deleteAction: (id: number) => Promise<void>;
}

export function VariantSection({
  title,
  fieldName,
  placeholder,
  items,
  createAction,
  updateAction,
  deleteAction,
}: VariantSectionProps) {
  return (
    <div className="flex flex-col gap-base rounded-lg border border-border bg-surface p-lg">
      <h2 className="text-h5 font-semibold text-foreground">{title}</h2>

      <form action={createAction} className="flex items-end gap-sm">
        <div className="flex-1">
          <Input name={fieldName} required placeholder={placeholder} />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Add
        </Button>
      </form>

      <div className="flex flex-col gap-sm">
        {items.map((item) => (
          <form key={item.id} action={updateAction.bind(null, item.id)} className="flex items-center gap-sm">
            <div className="flex-1">
              <Input name={fieldName} defaultValue={item.name} required />
            </div>
            <Button type="submit" variant="outline" size="sm">
              Save
            </Button>
            <VariantDeleteButton action={deleteAction.bind(null, item.id)} label={item.name} />
          </form>
        ))}
        {items.length === 0 && (
          <p className="text-small text-muted">No {title.toLowerCase()} yet.</p>
        )}
      </div>
    </div>
  );
}
