<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LogResource;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class LogController extends Controller
{
    public static function Routes()
    {
        Route::get('/logs', [LogController::class, 'index']);
        Route::get('/logs/{id}', [LogController::class, 'show']);
        Route::delete('/logs/{id}', [LogController::class, 'destroy']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tables = DB::connection()->getDoctrineSchemaManager()->listTableNames();
        $models = array_merge(array_diff($tables, [
            'failed_jobs',
            'migrations',
            'model_has_permissions',
            'model_has_roles',
            'password_resets',
            'personal_access_tokens',
            'role_has_permissions'
        ]));

        $logs = QueryBuilder::for(Log::class)
            ->allowedSorts('id')
            ->defaultSort('-id')
            ->allowedFilters([
                'id',
                'slug',
                'model',
                'username',
                AllowedFilter::scope('date_start'),
                AllowedFilter::scope('date_end'),
            ])
            ->get();

        return response()->json([
            'logs' => new LogResource($logs),
            'models' => $models
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $log = Log::find($id);
        return new LogResource($log);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Log::find($id)->delete();
        return response("", 204);
    }
}
