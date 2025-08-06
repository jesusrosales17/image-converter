
export const Header = () => {
  return (
    <div>
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Conversor de Imágenes
          </h1>
          <p className="text-sm text-gray-500">
            Convierte y optimiza tus imágenes
          </p>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Configuración
          </Button>
        </div> */}
      </div>
    </div>
  );
};
