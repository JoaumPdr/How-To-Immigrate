import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Sheet } from "@/components/ui/Sheet";
import { Tooltip } from "@/components/ui/Tooltip";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

describe("Snapshot de Componentes Base", () => {
  it("Button - variantes e estados", () => {
    const primary = render(<Button variant="primary">Primary</Button>);
    expect(primary.container).toMatchSnapshot();

    const outline = render(<Button variant="outline" size="sm">Outline</Button>);
    expect(outline.container).toMatchSnapshot();

    const loading = render(<Button isLoading>Loading</Button>);
    expect(loading.container).toMatchSnapshot();
  });

  it("Card - estrutura", () => {
    const { container } = render(
      <Card isHoverable>
        <CardHeader>
          <CardTitle>Título do Card</CardTitle>
          <CardDescription>Descrição do Card</CardDescription>
        </CardHeader>
        <CardContent>Conteúdo do Card</CardContent>
        <CardFooter>Rodapé do Card</CardFooter>
      </Card>
    );
    expect(container).toMatchSnapshot();
  });

  it("Badge - variantes", () => {
    const primary = render(<Badge variant="primary">Badge Primary</Badge>);
    expect(primary.container).toMatchSnapshot();

    const success = render(<Badge variant="success">Badge Success</Badge>);
    expect(success.container).toMatchSnapshot();
  });

  it("Input - estados", () => {
    const normal = render(<Input placeholder="Digite algo" />);
    expect(normal.container).toMatchSnapshot();

    const error = render(<Input hasError placeholder="Erro" />);
    expect(error.container).toMatchSnapshot();
  });

  it("Select - renderização", () => {
    const { container } = render(
      <Select>
        <option value="1">Opção 1</option>
        <option value="2">Opção 2</option>
      </Select>
    );
    expect(container).toMatchSnapshot();
  });

  it("Modal - fechado", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Modal Fechado">
        Conteúdo do Modal
      </Modal>
    );
    expect(container).toMatchSnapshot();
  });

  it("Sheet - fechado", () => {
    const { container } = render(
      <Sheet isOpen={false} onClose={() => {}} title="Sheet Fechada">
        Conteúdo do Sheet
      </Sheet>
    );
    expect(container).toMatchSnapshot();
  });

  it("Tooltip - dica rápida", () => {
    const { container } = render(
      <Tooltip content="Informação complementar">
        <span>Passe o mouse</span>
      </Tooltip>
    );
    expect(container).toMatchSnapshot();
  });

  it("LoadingSpinner - tamanhos", () => {
    const { container } = render(<LoadingSpinner size="md" />);
    expect(container).toMatchSnapshot();
  });

  it("EmptyState - ações", () => {
    const { container } = render(
      <EmptyState
        title="Nenhum resultado"
        description="Refine sua busca"
        actionLabel="Limpar filtros"
        onAction={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("ErrorBoundary - comportamento normal", () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Tudo funcionando</div>
      </ErrorBoundary>
    );
    expect(container).toMatchSnapshot();
  });
});
