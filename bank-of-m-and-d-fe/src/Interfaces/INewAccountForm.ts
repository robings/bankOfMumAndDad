export interface INewAccountFormProps {
  closeModal(): void;
}

export interface INewAccountFormInput {
  firstName: string;
  lastName: string;
  openingBalance: number | null;
}
