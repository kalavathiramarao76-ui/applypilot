import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = {
  type: "service_account",
  project_id: "app1-99b5a",
  private_key_id: "3c17b08808bbd98417dc0a5d62c1502ae2ab7cce",
  private_key: process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCacu3s/uA/lHGt\nWzYzDb5QVzF+dMDTIeHd19y24vz2fJtQE5fVwxhk/uAGETYWk4tiZZE4c9+Jz6b2\n/JENe0ZWGOjMEE7ILYrh/3etvOZgtyMOMT8BmDzedRDy16QycjXBbzoqQzvtZWFh\nC2DWWOmuEnva54cPpzlzIjO/Syx3M0YlLQmrPD7UvIAzIMHbWUoVzdEamMnwQaL2\n/+HbMtNllEfoNq1IauKtbB1sBM9vl/XpPMR3t95xciQpMQKLKwJtdq+KV+r6hRBu\n5SXqSqGBm2AHqHIIx8iWQQHR+KN/FbEHIZnbMaIfMq5It3fcQWSBQBiVgkbC1arL\nNhw8R5pnAgMBAAECggEAGKAn3MMWsOHTmOG+K+MOa8jl6f+7mZkBZlm7UKhdz6nh\nKaILci3VKeU+2uN2TaCLd3jc8An++P4pj5/dkNoNm5Sv1DmVa3K3fik5b8jQAq5b\nNzFq66+A+lyNWJWWvI8GkHz84oLYf0Ahh/5EcRNkJDkWPmTusp7lw2cPUSTZ8Myg\nraWf5XZAUIj5++dEyaibPKPwZra/tC9rBtzsAd4ax7/lvfj9h513dth3pY8X8dY2\npnAuTzUkHQooAJby26OzC6YmG7vhPYL8+VkykpqekbxX5nbgLvcO2uivX31Ymesj\nZbeCOEIDQtPOJpEfaUiw8v6mruRwHaJcFWW0itCwoQKBgQDHyRGPVB7cwWcedwQR\nzHXSmZZRRdJHlvtJ4t/bLJ2HDMHANopY9EkmYD785ee6x96Q6Yv9frDJneDWBey+\ntdj72yWpi262CyM92rpJiN0xY5Eft3KP/MPoMZ0TEIVssU6ZCY/6bKBUPoqt8OiW\n8JRfl20fJgHjB+mrfb+XTperYwKBgQDF6C+o+fce8eKQ4eAb3Uz8uuwU6se5UX0+\n0y/t4sOBDnFQP1eTEHkr0GVAMUeCUsYGL/dZZRDuKY2Wp0LftxuBo4CCPfjcxPGn\nSeXn4jszxn2FRFFKNHlDvwmILnhXIMmLR2t4kMufv+IGKijS4XtQFaNwAaLX50lQ\nOJx2N1m+LQKBgHQpI22bsooWZXegKZyTrdnydSTyHM6FKbyPDitoaHsyXqD81Tnd\nZ37JrTXsEu1V8sF9GWkdtXq0shqevUUxhGUDyYUnzgpItYfsWi4RRtLFmoa/afvw\nMpQZ7MM98uX8vb9bgPxRFnOFHar/DK1eWlauO8NFnQk8+487gR9fke4TAoGBALhL\n/oYXMUAJ9PkCv1ZzgUwhLdRUxuUWs9GbjRi0gWdfcbpPIlh7kLtyd7eNrI/6URpV\n9Lu02E1RON9Ap4/5zo2tGvEukN/WL0ugD48fKA6RGzbNZf36W6rw7gl5bOuGRumC\n+tvtyxHa+LrQ6+9ltxXe8LJPc7wnUCh6b4nPBa2JAoGANNaaWrbFx4xdGph7x0sH\nJS3QF2J6h4/VN4DbrfVmb85WhY+v2Z8kZBe+ucW5gcRsusNkd6QnTzalooKtl+YH\ncQDJEsarZ9//PfzXCLozk6trCcZbqJ76ZZD0lQQ0eh++BwaKerOsQmODaisw3vyT\namr+j13E1F/U17UiDheUx18=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@app1-99b5a.iam.gserviceaccount.com",
  client_id: "113840129232728094578",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
};

const adminApp =
  getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount as any) })
    : getApps()[0];

export const adminAuth = getAuth(adminApp);
